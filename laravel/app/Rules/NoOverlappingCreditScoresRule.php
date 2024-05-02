<?php

namespace App\Rules;

use App\Models\CreditScore;
use Illuminate\Contracts\Validation\Rule;

class NoOverlappingCreditScoresRule implements Rule
{
    private object $overlap;

    private string $rating;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(string $rating)
    {
        $this->rating = $rating;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     */
    public function passes($attribute, $value): bool
    {
        $int_value = intval($value);
        $ranges = CreditScore::where('low', '<=', $int_value)
            ->where('high', '>=', $int_value)
            ->where('rating', '!=', $this->rating)
            ->get();

        if (count($ranges)) {
            $this->overlap = $ranges[0];
        }

        return count($ranges) === 0;
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        $overlapStr = sprintf('%s: low - %u, high - %u', ucfirst($this->overlap->rating), $this->overlap->low, $this->overlap->high);

        return sprintf('Value is overlap with another rating(%s)', $overlapStr);
    }
}
