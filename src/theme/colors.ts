export type AppThemeName = 'light' | 'dark';

export type AppColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  info: string;
  infoSoft: string;
  shadow: string;
};

const lightColors: AppColors = {
  background: '#F7F9F8',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F0',
  border: '#DFE7E2',
  text: '#101828',
  textMuted: '#667085',
  primary: '#19C864',
  primaryDark: '#0E5A43',
  primarySoft: '#D8F8E5',
  danger: '#E5484D',
  dangerSoft: '#FDE8E9',
  warning: '#F2C14E',
  info: '#5B9CE2',
  infoSoft: '#E7F1FB',
  shadow: '#102A1F',
};

const darkColors: AppColors = {
  background: '#07110D',
  surface: '#102019',
  surfaceMuted: '#172A21',
  border: '#274137',
  text: '#F4F7F5',
  textMuted: '#A7B7AF',
  primary: '#28D875',
  primaryDark: '#99F2BD',
  primarySoft: '#153D29',
  danger: '#FF6B6F',
  dangerSoft: '#3D1F21',
  warning: '#FFD166',
  info: '#78B7F4',
  infoSoft: '#172F48',
  shadow: '#000000',
};

export function getAppColors(themeName: AppThemeName): AppColors {
  return themeName === 'dark' ? darkColors : lightColors;
}
