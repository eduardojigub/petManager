type TranslateFn = (key: string, params?: Record<string, string>) => string;

interface DogProfile {
  birthday?: string;
  age?: number;
}

export function calculateAge(birthday: Date, t: TranslateFn): string {
  const now = new Date();
  let years = now.getFullYear() - birthday.getFullYear();
  let months = now.getMonth() - birthday.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (now.getDate() < birthday.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  if (years === 0) {
    return t('editPet.ageMonthsOld', { count: String(months) });
  }
  if (months === 0) {
    return t('editPet.ageYearsOld', { count: String(years) });
  }
  return t('editPet.ageYearsMonthsOld', { years: String(years), months: String(months) });
}

export function ageToDecimal(birthday: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - birthday.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return years.toFixed(1);
}

export function calculateDisplayAge(dog: DogProfile, t: TranslateFn): string {
  if (dog.birthday) {
    const bday = new Date(dog.birthday);
    const now = new Date();
    let years = now.getFullYear() - bday.getFullYear();
    let months = now.getMonth() - bday.getMonth();
    if (months < 0) { years--; months += 12; }
    if (now.getDate() < bday.getDate()) { months--; if (months < 0) { years--; months += 12; } }
    if (years === 0) return t('profile.ageMonths', { count: String(months) });
    if (months === 0) return t('profile.ageYears', { count: String(years) });
    return t('profile.ageYearsMonths', { years: String(years), months: String(months) });
  }
  return dog.age ? t('profile.years', { count: String(dog.age) }) : '';
}
