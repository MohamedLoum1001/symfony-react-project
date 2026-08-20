<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users', name: 'api_users_')]
class ApiUserController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET', 'OPTIONS'])]
    public function list(UserRepository $userRepository, UserService $userService, Request $request): JsonResponse
    {
        if ($request->isMethod('OPTIONS')) {
            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        $users = $userRepository->findAll();

        $data = array_map(function (User $user) use ($userService) {
            $userService->calculateAge($user);

            return [
                'id' => $user->getId(),
                'birthDate' => $user->getBirthDate() ? $user->getBirthDate()->format('d/m/Y') : null,
                'age' => $user->getAge(),
            ];
        }, $users);

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST', 'OPTIONS'])]
    public function create(Request $request, EntityManagerInterface $em, UserService $userService): JsonResponse
    {
        if ($request->isMethod('OPTIONS')) {
            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        $payload = json_decode($request->getContent(), true);

        if (empty($payload['birthDate'])) {
            return $this->json(['error' => 'La date de naissance est obligatoire.'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $user = new User();
            $user->setBirthDate(new \DateTime($payload['birthDate']));

            $em->persist($user);
            $em->flush();

            $userService->calculateAge($user);

            return $this->json([
                'id' => $user->getId(),
                'birthDate' => $user->getBirthDate()->format('d/m/Y'),
                'age' => $user->getAge(),
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Format de date invalide.'], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'show', methods: ['GET', 'OPTIONS'])]
    public function show(User $user, UserService $userService, Request $request): JsonResponse
    {
        if ($request->isMethod('OPTIONS')) {
            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        $userService->calculateAge($user);

        $possessions = [];
        foreach ($user->getPossessions() as $possession) {
            $possessions[] = [
                'id' => $possession->getId(),
                'nom' => $possession->getNom(),
                'valeur' => $possession->getValeur(),
                'type' => $possession->getType(),
            ];
        }

        return $this->json([
            'id' => $user->getId(),
            'birthDate' => $user->getBirthDate() ? $user->getBirthDate()->format('d/m/Y') : null,
            'age' => $user->getAge(),
            'possessions' => $possessions,
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE', 'OPTIONS'])]
    public function delete(User $user, EntityManagerInterface $em, Request $request): JsonResponse
    {
        if ($request->isMethod('OPTIONS')) {
            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        $em->remove($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur supprimé avec succès.'], Response::HTTP_OK);
    }
}