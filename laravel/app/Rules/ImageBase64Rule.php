<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ImageBase64Rule implements Rule
{
    private const ALLOWED_FORMAT = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     */
    public function passes($attribute, $value): bool
    {
        $explode = $this->explodeString($value);
        $format = $this->dataFormat($explode);

        if (! in_array($format, self::ALLOWED_FORMAT)) {
            return false;
        }

        if (! preg_match('%^[a-zA-Z0-9/+]*={0,2}$%', $explode[1])) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return 'The :attribute must be a valid base-64 image string.';
    }

    private function explodeString($value): array
    {
        return explode(',', $value);
    }

    private function dataFormat($explode): array|string
    {
        return str_replace(
            ['data:image/', ';', 'base64'],
            ['', '', ''],
            $explode[0]
        );
    }
}
