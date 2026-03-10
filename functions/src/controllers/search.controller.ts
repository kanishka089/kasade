import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { searchFiltersSchema } from '../utils/validators';
import { success, error } from '../utils/response';
import { getDoc, queryDocs, collections } from '../services/firestore.service';
import { UserProfile } from '../types/user';
import { MatchResult } from '../types/horoscope';
import { calculateCompatibility } from '../horoscope/matching/ashtakootMilan';
import { horoscopeDataToResult } from '../utils/horoscopeMapper';

export async function searchProfiles(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = searchFiltersSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: any) => e.message).join(', ')));
      return;
    }

    const { gender, ageRange, religion, page, limit } = parsed.data;
    const viewerUid = req.user!.uid;
    const viewer = await getDoc<UserProfile>(collections.users, viewerUid);

    if (!viewer) {
      res.status(404).json(error('User profile not found'));
      return;
    }

    // Default to opposite gender if not specified
    const searchGender = gender || (viewer.gender === 'male' ? 'female' : 'male');

    const filters: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: unknown }> = [
      { field: 'gender', op: '==', value: searchGender },
      { field: 'isActive', op: '==', value: true },
      { field: 'isSuspended', op: '==', value: false },
      { field: 'profileComplete', op: '==', value: true },
    ];

    if (ageRange) {
      filters.push({ field: 'age', op: '>=', value: ageRange.min });
      filters.push({ field: 'age', op: '<=', value: ageRange.max });
    }

    if (religion && religion.length > 0) {
      filters.push({ field: 'religion', op: 'in', value: religion });
    }

    const offset = (page - 1) * limit;
    const { docs, total } = await queryDocs<UserProfile>(collections.users, filters, {
      orderBy: 'createdAt',
      direction: 'desc',
      limit,
      offset,
    });

    // Calculate compatibility for each result
    const results = docs
      .filter((doc) => doc.uid !== viewerUid)
      .map((profile) => {
        let compatibility: MatchResult | null = null;

        if (viewer.horoscope && profile.horoscope) {
          const viewerResult = horoscopeDataToResult(viewer.horoscope);
          const profileResult = horoscopeDataToResult(profile.horoscope);
          compatibility = calculateCompatibility(viewerResult, profileResult);
        }

        // Hide contact number in search results
        const { contactNumber: _hidden, ...safeProfile } = profile;
        return { ...safeProfile, compatibility };
      });

    res.json(success({
      profiles: results,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }));
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}
