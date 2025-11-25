import embedInit from './embed-iframe-init'
import { SdkActionManager } from './sdk-action-manager'

export let sdkActionManager: SdkActionManager | null = null
if (typeof window !== 'undefined') {
  embedInit()
  sdkActionManager = new SdkActionManager(window.getEmbedNamespace())
}
