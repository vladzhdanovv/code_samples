<?php

namespace App\Enums;

use App\Traits\GetCaseValuesTrait;

enum BusinessType: string
{
    use GetCaseValuesTrait;

    case SoleProprietor = 'sole_proprietor';
    case Partnership = 'partnership';
    case Llc = 'llc';
    case Corporation = 'corporation';
}
