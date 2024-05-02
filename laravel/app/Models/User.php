<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

/**
 * @property string $password
 * @property string $full_name
 * @property string $token
 * @property string $cognito_username
 * @property string $email
 * @property string $first_name
 * @property string $last_name
 * @property ModeratorshipDetail|null $moderatorshipDetail
 * @property TransunionSubscriber|null $transunionSubscriber
 * @property Role $role
 * @property Maker[]|Collection $makers
 * @property ApplicationField[]|Collection $fields
 *
 * @method hasMaker(int $makerId)
 */
class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;


    protected $fillable = [
        'email',
        'role_id',
        'cognito_username',
        'first_name',
        'last_name',
        'phone_number',
    ];


    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function loginTokens(): HasMany
    {
        return $this->hasMany(LoginToken::class);
    }

    public function moderatorshipDetail(): HasOne
    {
        return $this->hasOne(ModeratorshipDetail::class, 'moderator_id');
    }

    public function makers(): BelongsToMany
    {
        return $this->belongsToMany(Maker::class, 'moderator_makers', 'moderator_id')
            ->using(ModeratorMaker::class)
            ->withPivot(['link', 'username']);
    }

    public function creditScores(): BelongsToMany
    {
        return $this->belongsToMany(CreditScore::class, 'moderator_credit_scores', 'moderator_id')
            ->using(ModeratorCreditScore::class)
            ->withPivot('apr', 'id');
    }

    public function transunionSubscriber(): HasOne
    {
        return $this->hasOne(TransunionSubscriber::class, 'moderator_id');
    }

    public function fields(): BelongsToMany
    {
        return $this->belongsToMany(ApplicationField::class, 'moderator_custom_application_field', 'moderator_id');
    }

    public function plans(): BelongsToMany
    {
        return $this->belongsToMany(Plan::class, ModeratorPlan::class);
    }


    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => sprintf('%s %s', $this->first_name, $this->last_name),
        );
    }


    public function scopeHasMaker(Builder $query, int $makerId): void
    {
        $query->whereHas('makers', function ($q) use ($makerId) {
            $q->where('makers.id', $makerId);
        });
    }


    public function save(array $options = []): bool
    {
         if ($this->password) {
            unset($this->password);
        }

        return parent::save($options);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
