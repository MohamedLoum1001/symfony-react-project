<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $birthDate = null;

    /**
     * Propriété virtuelle (présente dans l'objet, non persistée en BDD)
     */
    private ?int $age = null;

    /**
     * @var Collection<int, Possession>
     */
    #[ORM\OneToMany(targetEntity: Possession::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $possessions;

    public function __construct()
    {
        $this->possessions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(?\DateTimeInterface $birthDate): static
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    public function getAge(): ?int
    {
        return $this->age;
    }

    public function setAge(?int $age): static
    {
        $this->age = $age;
        return $this;
    }

    /**
     * @return Collection<int, Possession>
     */
    public function getPossessions(): Collection
    {
        return $this->possessions;
    }

    public function addPossession(Possession $possession): static
    {
        if (!$this->possessions->contains($possession)) {
            $this->possessions->add($possession);
            $possession->setUser($this);
        }

        return $this;
    }

    public function removePossession(Possession $possession): static
    {
        if ($this->possessions->removeElement($possession)) {
            if ($possession->getUser() === $this) {
                $possession->setUser(null);
            }
        }

        return $this;
    }
}