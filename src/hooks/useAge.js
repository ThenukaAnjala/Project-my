import { useEffect, useState } from 'react'

const calculateAge = (birthDate, referenceDate) => {
  const now = referenceDate
  let age = now.getFullYear() - birthDate.getFullYear()

  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate())

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return age
}

export const useAge = (birthDate) => {
  const [age, setAge] = useState(() => calculateAge(birthDate, new Date()))

  useEffect(() => {
    if (!birthDate || Number.isNaN(birthDate.getTime())) {
      return undefined
    }

    const updateAge = () => setAge(calculateAge(birthDate, new Date()))

    updateAge()

    const dailyIntervalMs = 1000 * 60 * 60 * 24
    const intervalId = window.setInterval(updateAge, dailyIntervalMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [birthDate])

  return age
}
