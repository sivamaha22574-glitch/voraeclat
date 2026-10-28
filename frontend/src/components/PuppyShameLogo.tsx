import React from 'react';
import { VoraeclatLogo, VoraeclatLogoProps } from './VoraeclatLogo';

export type PuppyShameLogoProps = VoraeclatLogoProps;
export const PuppyShameLogo: React.FC<PuppyShameLogoProps> = (props) => {
  return <VoraeclatLogo {...props} />;
};

export { VoraeclatLogo };
export default VoraeclatLogo;
