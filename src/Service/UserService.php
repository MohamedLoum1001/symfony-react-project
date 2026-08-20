<?php

namespace App\Service;

use App\Entity\User;

class UserService
{
    /**
     * Calcule l'âge à partir de birthDate et l'injecte dans l'objet User
     */
    public function calculateAge(User $user): ?int
    {
        $birthDate = $user->getBirthDate();
        if (!$birthDate) {
            return null;
        }

        $today = new \DateTime('today');
        $age = $birthDate->diff($today)->y;

        $user->setAge($age);

        return $age;
    }
}