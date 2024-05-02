<?php

namespace App\Http\Resources\V1;

use App\Http\Resources\BaseResource;
use App\Models\Role;
use App\Models\User;

/** @mixin User */
class UserResource extends BaseResource
{
    public function toArray($request): array
    {
        $data = [
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone_number' => $this->phone_number,
            'role' => $this->role->name,

        ];

        if ($this->role->name === Role::ROLE_moderator) {
            $data['moderatorship'] = [
                'name' => $this->moderatorshipDetail->name,
            ];
        }

        return $this->withResourceName($data);
    }
}
