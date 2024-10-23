import { Request, Response } from 'express';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';