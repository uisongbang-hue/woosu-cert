/**
 * 보험나이 계산
 * 표준 공식 (보험업감독규정·생명/손해보험 표준약관):
 *   1) 기준일(계약일) 시점의 만 나이를 구한다.
 *   2) 직전 생일로부터 경과한 일수가 6개월(약 183일) 이상이면 +1, 아니면 그대로.
 * 결과는 정수.
 */
export function calcInsuranceAge(birthISO: string, refISO: string) {
  const birth = new Date(birthISO + "T00:00:00");
  const ref = new Date(refISO + "T00:00:00");
  if (isNaN(birth.getTime()) || isNaN(ref.getTime()) || ref < birth) {
    return null;
  }

  // 만 나이
  let age = ref.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    ref.getMonth() < birth.getMonth() ||
    (ref.getMonth() === birth.getMonth() && ref.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;

  // 직전 생일
  const lastBirthday = new Date(birth);
  lastBirthday.setFullYear(birth.getFullYear() + age);

  // 다음 생일
  const nextBirthday = new Date(lastBirthday);
  nextBirthday.setFullYear(lastBirthday.getFullYear() + 1);

  // 6개월(=다음 생일까지 6개월 미만 남았는지) 판정
  const halfYear = new Date(lastBirthday);
  halfYear.setMonth(halfYear.getMonth() + 6);

  const insuranceAge = ref >= halfYear ? age + 1 : age;

  const daysSinceLastBday = Math.floor(
    (ref.getTime() - lastBirthday.getTime()) / 86400000
  );
  const daysToNextBday = Math.floor(
    (nextBirthday.getTime() - ref.getTime()) / 86400000
  );

  return {
    age,
    insuranceAge,
    lastBirthday: lastBirthday.toISOString().slice(0, 10),
    nextBirthday: nextBirthday.toISOString().slice(0, 10),
    halfYearMark: halfYear.toISOString().slice(0, 10),
    daysSinceLastBday,
    daysToNextBday,
    bumpedUp: insuranceAge !== age,
  };
}
