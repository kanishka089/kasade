import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { horoscopeInputSchema, userProvidedHoroscopeSchema } from '../utils/validators';
import { success, error } from '../utils/response';
import { getDoc, setDoc, collections } from '../services/firestore.service';
import { UserProfile } from '../types/user';
import { HoroscopeData } from '../types/horoscope';
import { generateHoroscope as engineGenerateHoroscope } from '../horoscope/birthChart';
import { validateHoroscope as engineValidateHoroscope } from '../horoscope/validation';
import { BirthData, HoroscopeResult } from '../horoscope/types';
import { horoscopeResultToData } from '../utils/horoscopeMapper';

export async function generateHoroscope(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = horoscopeInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: { message: string }) => e.message).join(', ')));
      return;
    }

    const { birthDate, birthTime, birthPlace } = parsed.data;

    const birthData: BirthData = {
      date: birthDate,
      time: birthTime,
      place: birthPlace,
    };

    const engineResult = engineGenerateHoroscope(birthData);
    const chart = horoscopeResultToData(engineResult, birthDate, birthTime, birthPlace, 'calculated');

    res.json(success(chart, 'Horoscope generated successfully'));
  } catch (err) {
    console.error('Generate horoscope error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function validateHoroscope(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = userProvidedHoroscopeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: { message: string }) => e.message).join(', ')));
      return;
    }

    const { birthDate, birthTime, birthPlace } = parsed.data;

    const birthData: BirthData = {
      date: birthDate,
      time: birthTime,
      place: birthPlace,
    };

    const engineResult = engineGenerateHoroscope(birthData);
    const calculated = horoscopeResultToData(engineResult, birthDate, birthTime, birthPlace, 'calculated');

    const userProvided: HoroscopeData = {
      birthDate: parsed.data.birthDate,
      birthTime: parsed.data.birthTime,
      birthPlace: parsed.data.birthPlace,
      rashi: parsed.data.rashi,
      nakshatra: parsed.data.nakshatra,
      nakshatraPada: parsed.data.nakshatraPada,
      lagna: parsed.data.lagna,
      planetPositions: parsed.data.planetPositions as Record<string, { rashi: number; degree: number; nakshatra: number }>,
      horoscopeSource: 'user_provided',
    };

    const userProvidedPartial: Partial<HoroscopeResult> = {
      rashi: parsed.data.rashi,
      nakshatra: parsed.data.nakshatra,
      nakshatraPada: parsed.data.nakshatraPada,
      lagna: parsed.data.lagna,
    };

    const validation = engineValidateHoroscope(engineResult, userProvidedPartial);

    res.json(success({
      calculated,
      userProvided,
      matches: validation.isMatch,
      differences: validation.differences,
    }, validation.isMatch ? 'Horoscope data matches' : 'Horoscope data differs from calculated values'));
  } catch (err) {
    console.error('Validate horoscope error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function confirmHoroscope(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { horoscope, useUserProvided } = req.body;

    if (!horoscope) {
      res.status(400).json(error('Horoscope data is required'));
      return;
    }

    const uid = req.user!.uid;
    const existing = await getDoc<UserProfile>(collections.users, uid);
    if (!existing) {
      res.status(404).json(error('User not found'));
      return;
    }

    const horoscopeData: HoroscopeData = {
      ...horoscope,
      horoscopeSource: useUserProvided ? 'user_confirmed_override' : 'calculated',
    };

    await setDoc(collections.users, uid, {
      horoscope: horoscopeData,
      updatedAt: new Date().toISOString(),
    });

    res.json(success(horoscopeData, 'Horoscope saved to profile'));
  } catch (err) {
    console.error('Confirm horoscope error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}
