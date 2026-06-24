import {
  Feather,
  Heart,
  HeartHandshake,
  Leaf,
  Moon,
  Star,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import { MESSAGE_CATEGORY_LABELS } from "@/lib/constants";
import type { MessageCategory } from "@/lib/types";

export interface PulseCategoryOption {
  id: MessageCategory;
  label: string;
  icon: LucideIcon;
  line: string;
}

export const PULSE_CATEGORIES: PulseCategoryOption[] = [
  {
    id: "loving",
    label: MESSAGE_CATEGORY_LABELS.loving,
    icon: Heart,
    line: "Thinking of you with love.",
  },
  {
    id: "caring",
    label: MESSAGE_CATEGORY_LABELS.caring,
    icon: HeartHandshake,
    line: "Hope you are looking after yourself.",
  },
  {
    id: "encouraging",
    label: MESSAGE_CATEGORY_LABELS.encouraging,
    icon: Sunrise,
    line: "You've got this.",
  },
  {
    id: "grateful",
    label: MESSAGE_CATEGORY_LABELS.grateful,
    icon: Leaf,
    line: "Thank you for being you.",
  },
  {
    id: "missing_you",
    label: MESSAGE_CATEGORY_LABELS.missing_you,
    icon: Moon,
    line: "Wish you were near.",
  },
  {
    id: "proud_of_you",
    label: MESSAGE_CATEGORY_LABELS.proud_of_you,
    icon: Star,
    line: "So proud of you.",
  },
  {
    id: "just_because",
    label: MESSAGE_CATEGORY_LABELS.just_because,
    icon: Feather,
    line: "No reason. Just you.",
  },
];
