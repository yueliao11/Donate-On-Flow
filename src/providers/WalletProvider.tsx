import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { customTheme } from '../config/rainbowkit'

export const WalletProvider = ({ children }) => {
  return (
    <RainbowKitProvider theme={customTheme}>
      {children}
    </RainbowKitProvider>
  )
} 