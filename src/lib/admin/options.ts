import type { CareerPositionValues, GalleryItemValues } from '@/lib/schemas'

export type SelectOption<TValue extends string> = {
  value: TValue
  label: string
}

export type CareerDepartment = CareerPositionValues['department']
export type EmploymentType = CareerPositionValues['employment_type']
export type GalleryCategory = NonNullable<GalleryItemValues['category']>
export type SubmissionType = 'contact' | 'career'
export type SubmissionStatus = 'unread' | 'read' | 'archived'

export const careerDepartmentOptions: SelectOption<CareerDepartment>[] = [
  { value: 'architecture', label: 'Architecture' },
  { value: 'interior-design', label: 'Interior Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'management', label: 'Management' },
]

export const employmentTypeOptions: SelectOption<EmploymentType>[] = [
  { value: 'full-time', label: 'Full-Time' },
  { value: 'part-time', label: 'Part-Time' },
  { value: 'internship', label: 'Internship' },
]

export const galleryCategoryOptions: SelectOption<GalleryCategory>[] = [
  { value: 'architecture', label: 'Architecture' },
  { value: 'interiors', label: 'Interiors' },
  { value: 'details', label: 'Details' },
  { value: 'process', label: 'Process' },
]

export const submissionTypeOptions: SubmissionType[] = ['contact', 'career']
export const submissionStatusOptions: SubmissionStatus[] = [
  'unread',
  'read',
  'archived',
]

export function isGalleryCategory(value: string): value is GalleryCategory {
  return galleryCategoryOptions.some((option) => option.value === value)
}

export function isSubmissionType(value: string): value is SubmissionType {
  return submissionTypeOptions.includes(value as SubmissionType)
}

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return submissionStatusOptions.includes(value as SubmissionStatus)
}
