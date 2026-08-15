import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ComponentType } from "react";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import StairsOutlinedIcon from "@mui/icons-material/StairsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";

type IconComponent = ComponentType<SvgIconProps>;

export const AmenityIcons = {
  bed: BedOutlinedIcon,
  bath: BathtubOutlinedIcon,
  room: MeetingRoomOutlinedIcon,
  area: SquareFootOutlinedIcon,
  floor: StairsOutlinedIcon,
  price: PaymentsOutlinedIcon,
  type: ApartmentOutlinedIcon,
  finishing: HandymanOutlinedIcon,
  search: SearchOutlinedIcon,
  project: DomainOutlinedIcon,
  add: AddHomeOutlinedIcon,
} as const satisfies Record<string, IconComponent>;

export type AmenityIconName = keyof typeof AmenityIcons;
