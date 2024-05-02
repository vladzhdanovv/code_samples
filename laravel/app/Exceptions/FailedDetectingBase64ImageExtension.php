<?php

namespace App\Exceptions;

use Exception;
use Throwable;

class FailedDetectingBase64ImageExtension extends Exception
{
    public function __construct($base64, $code = 0, Throwable $previous = null)
    {
        $message = sprintf('Unable to detect an extension of the base64 image starting with: %s...', substr($base64, 0, 50));

        parent::__construct($message, $code, $previous);
    }
}
