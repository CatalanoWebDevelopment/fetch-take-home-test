import confetti from 'canvas-confetti'
import { getMatch } from '@/lib/api'
import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Dog } from '@/types'

export const useMatchHandler = (favorites: Dog[]) => {
  const triggerConfetti = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  const handleMatch = useCallback(async () => {
    if (favorites.length === 0) {
      toast.error('Please select at least one dog to match with! 🐾', {
        duration: 3000,
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          padding: '16px',
          borderRadius: '8px',
        },
      })
      return
    }

    try {
      const result = await getMatch(favorites.map((dog) => dog.id))
      const matchedDog = favorites.find((dog) => dog.id === result.match)

      if (matchedDog) {
        triggerConfetti()

        toast.custom(
          (t: { visible: boolean }) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={matchedDog.img}
                      alt={matchedDog.name}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-lg font-medium text-gray-900">It&apos;s a match! 🎉</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {matchedDog.name} ({matchedDog.breed}, {matchedDog.age} years) would love to
                      be your new companion!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
          {
            duration: 5000,
            position: 'top-center',
          }
        )
      }
    } catch (error) {
      console.error('Failed to generate match', error)

      toast.error('Failed to generate match. Please try again! 🐾', {
        duration: 3000,
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          padding: '16px',
          borderRadius: '8px',
        },
      })
    }
  }, [favorites])

  return { handleMatch }
}
