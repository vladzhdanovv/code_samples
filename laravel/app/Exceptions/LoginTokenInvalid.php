<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class LoginTokenInvalid extends Exception
{
    public function __construct($message = 'Login token invalid', $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
