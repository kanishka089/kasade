import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { success, error } from '../utils/response';
import { getDoc, collections } from '../services/firestore.service';
import { UserProfile } from '../types/user';

import { horoscopeInputSchema } from '../utils/validators';
import { generateHoroscope } from '../horoscope/birthChart';
import { calculateCompatibility } from '../horoscope/matching/ashtakootMilan';
import { BirthData } from '../horoscope/types';
import { horoscopeResultToData, horoscopeDataToResult } from '../utils/horoscopeMapper';

export async function getMatchWithUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const targetUid = req.params.uid as string;
    const viewerUid = req.user!.uid;

    const [viewer, target] = await Promise.all([
      getDoc<UserProfile>(collections.users, viewerUid),
      getDoc<UserProfile>(collections.users, targetUid),
    ]);

    if (!viewer) {
      res.status(404).json(error('Your profile not found'));
      return;
    }

    if (!target || !target.isActive || target.isSuspended) {
      res.status(404).json(error('Target profile not found'));
      return;
    }

    if (!viewer.horoscope) {
      res.status(400).json(error('Your horoscope data is required for matching'));
      return;
    }

    if (!target.horoscope) {
      res.status(400).json(error('Target user has no horoscope data'));
      return;
    }

    const viewerResult = horoscopeDataToResult(viewer.horoscope);
    const targetResult = horoscopeDataToResult(target.horoscope);
    const result = calculateCompatibility(viewerResult, targetResult);

    res.json(success({
      viewer: { uid: viewer.uid, displayName: viewer.displayName },
      target: { uid: target.uid, displayName: target.displayName },
      compatibility: result,
    }));
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function customMatch(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { person1, person2 } = req.body;

    const p1Parsed = horoscopeInputSchema.safeParse(person1);
    const p2Parsed = horoscopeInputSchema.safeParse(person2);

    if (!p1Parsed.success || !p2Parsed.success) {
      res.status(400).json(error('Valid birth data required for both persons'));
      return;
    }

    const birthData1: BirthData = {
      date: p1Parsed.data.birthDate,
      time: p1Parsed.data.birthTime,
      place: p1Parsed.data.birthPlace,
    };

    const birthData2: BirthData = {
      date: p2Parsed.data.birthDate,
      time: p2Parsed.data.birthTime,
      place: p2Parsed.data.birthPlace,
    };

    const engineResult1 = generateHoroscope(birthData1);
    const engineResult2 = generateHoroscope(birthData2);

    const chart1 = horoscopeResultToData(engineResult1, p1Parsed.data.birthDate, p1Parsed.data.birthTime, p1Parsed.data.birthPlace, 'calculated');
    const chart2 = horoscopeResultToData(engineResult2, p2Parsed.data.birthDate, p2Parsed.data.birthTime, p2Parsed.data.birthPlace, 'calculated');

    const result = calculateCompatibility(engineResult1, engineResult2);

    res.json(success({
      person1: { birthData: p1Parsed.data, chart: chart1 },
      person2: { birthData: p2Parsed.data, chart: chart2 },
      compatibility: result,
    }));
  } catch (err) {
    console.error('Custom match error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}
