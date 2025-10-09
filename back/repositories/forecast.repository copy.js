/**
 * @file repositories/Forecast.repository.js
 * @description Forecast repository 파일
 * 251008 v1.0 meerkat
 */
import { Op } from 'sequelize';
import db from '../db_index.js';

const { sequelize, Forecast } = db;
