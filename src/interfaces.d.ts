export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram: string
  contactWhatsApp: string
  contactPhone: string
  createdAt: Date
  salaryFrom?: number
  salaryTo?: number
  stages?: IStage[]
  result?: string
}

export interface IStage {
  name: string
  date: Date
  description: string
}
