import type React from "react";
import { StyleProp, TextStyle } from "react-native";

import { LinearGradientProps } from "expo-linear-gradient";

import type { Props as PressableProps } from "@showtime-xyz/universal.pressable";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type ButtonVariant =
  | "primary"
  | "danger"
  | "tertiary"
  | "secondary"
  | "text"
  | "gradient"
  | "outlined"
  | "base";

export type ButtonSize = "small" | "regular";

export type ButtonProps = {
  /**
   * Defines the button variant.
   * @default primary
   */
  variant?: ButtonVariant;
  /**
   * Defines the button theme.
   * @default undefined
   */
  theme?: "light" | "dark";
  children?: React.ReactNode | string;
} & PressableProps &
  Partial<
    Pick<
      BaseButtonProps,
      | "labelTW"
      | "iconOnly"
      | "size"
      | "accentColor"
      | "gradientProps"
      | "backgroundColors"
    >
  >;
export type BaseButtonProps = {
  /**
   * Defines the tailwind class names to
   * be applied to the button container.
   * @default undefined
   */
  tw?: TW;
  /**
   * Defines the tailwind class names to
   * be applied to the label.
   * @default undefined
   */
  labelTW?: TW;
  /**
   * Defines the inline style to
   * be applied to the label.
   * @default undefined
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Defines the background state colors.
   */
  backgroundColors?: {
    default: string[];
    pressed: string[];
  };
  /**
   * Defines the background state colors.
   */
  gradientProps?: LinearGradientProps;
  /**
   * Defines the button icons colour.
   * @default white|black
   */
  iconColor?: string[];
  /**
   * Defines if the button will only contains
   * an icon or not.
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Defines the button icon and text colors.
   * @default [black, white]
   */
  accentColor?: string | string[];
  /**
   * Defines the button size.
   * @default small
   */
  size?: ButtonSize;
  children?: React.ReactNode | string;
  isDark?: boolean;
} & PressableProps;
