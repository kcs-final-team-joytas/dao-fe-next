export interface LoungeProps {
  lounge_id: number
  name: string
  type: 'L0001' | 'L0002' | 'L0003' | 'L0004'
  user_id?: number
}
