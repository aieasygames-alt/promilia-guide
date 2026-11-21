import { z } from 'zod';
import data from '../data/redeem-codes.json';
import { redeemCodeSchema } from './redeem-codes.mjs';
export const redeemCodes = z.array(redeemCodeSchema).parse(data);
