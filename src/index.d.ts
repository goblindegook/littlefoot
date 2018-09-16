interface LittlefootSettings {
  activateCallback:
    | ((popover: HTMLElement, button: HTMLInputElement) => void)
    | null
  activateDelay: number
  activateOnHover: boolean
  allowDuplicates: boolean
  allowMultiple: boolean
  anchorParentSelector: string
  anchorPattern: RegExp
  buttonTemplate: string
  contentTemplate: string
  dismissDelay: number
  dismissOnUnhover: boolean
  footnoteParentClass: string
  footnoteSelector: string
  hoverDelay: number
  numberResetSelector: string | null
  scope: string | null
}

interface Littlefoot {
  activate(selector: string, className?: string): void
  dismiss(selector: string, delay?: number): void
  getSetting<K extends keyof LittlefootSettings>(key: K): LittlefootSettings[K]
  updateSetting<K extends keyof LittlefootSettings>(
    key: K,
    value: LittlefootSettings[K]
  ): void
}

export function littlefoot(settings?: Partial<LittlefootSettings>): Littlefoot
export default littlefoot
