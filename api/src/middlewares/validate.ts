/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

/**
 * custom modules
 */
import { ApiError, HttpStatus, ErrorCodes, sendErrorResponse } from '@/utils/apiResponse'

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : error.type,
      message: error.msg
    }))

    sendErrorResponse(res, new ApiError(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'Validation failed',
      ErrorCodes.VALIDATION_ERROR,
      errorMessages
    ))
  }
  next()
}

export default validate