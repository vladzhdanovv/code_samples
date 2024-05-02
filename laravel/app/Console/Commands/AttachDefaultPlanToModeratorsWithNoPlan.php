<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class AttachDefaultPlanToModeratorsWithNoPlan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plans:attach-default-plan-to-moderators-with-no-plan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Attach Free Plan to Moderators with no Plan';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $moderatorRole = Role::getByName(Role::ROLE_moderator);
        $moderatorsWithoutPlans = User::where('role_id', $moderatorRole->id)->whereDoesntHave('plans')->get();
        $defaultPlan = Plan::getDefaultPlan();

        foreach ($moderatorsWithoutPlans as $moderator) {
            $this->info("Added moderator $moderator->id to Lite plan");
            $moderator->plans()->sync([$defaultPlan->id]);
        }
    }
}
