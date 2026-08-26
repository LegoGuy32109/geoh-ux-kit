/**
 * nav.json stores icon names as strings, so this maps them back to components.
 * Every name here is imported from the same react-icons pack the real app uses
 * (see the import block at the top of geoh's useSidebarBehavior.ts) — several
 * names exist in more than one pack and render differently, so the pack matters.
 */
import type { IconType } from 'react-icons'
import { AiOutlineFileAdd, AiOutlineSend } from 'react-icons/ai'
import { BiBarChartSquare, BiBuildings, BiPurchaseTagAlt, BiSpreadsheet } from 'react-icons/bi'
import { BsCurrencyDollar, BsPersonBadge } from 'react-icons/bs'
import { CgNotes } from 'react-icons/cg'
import { FiTarget } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import { HiOutlineDocumentReport, HiOutlineLocationMarker, HiOutlineUserGroup } from 'react-icons/hi'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { IoMdCalendar } from 'react-icons/io'
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia'
import {
  MdDashboard,
  MdDirectionsCar,
  MdInsights,
  MdOutlineAddchart,
  MdOutlineBusiness,
  MdOutlineFax,
  MdOutlineMoveToInbox,
  MdOutlineOutbox,
  MdOutlinePayments
} from 'react-icons/md'
import {
  RiAccountCircleLine,
  RiBillLine,
  RiBuilding4Line,
  RiClipboardLine,
  RiPieChartLine,
  RiServiceLine,
  RiSettings5Line,
  RiShieldKeyholeLine,
  RiUser2Line,
  RiUserFollowLine,
  RiUserHeartLine,
  RiUserLocationLine,
  RiUserStarLine
} from 'react-icons/ri'
import {
  TbBuildingBank,
  TbChecklist,
  TbIdBadge2,
  TbPlug,
  TbReceiptDollar,
  TbReportMoney,
  TbUserSearch,
  TbZoomCode
} from 'react-icons/tb'
import { TiFolder } from 'react-icons/ti'

export const NAV_ICONS: Record<string, IconType> = {
  AiOutlineFileAdd,
  AiOutlineSend,
  BiBarChartSquare,
  BiBuildings,
  BiPurchaseTagAlt,
  BiSpreadsheet,
  BsCurrencyDollar,
  BsPersonBadge,
  CgNotes,
  FiTarget,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentReport,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  IoMdCalendar,
  LiaFileInvoiceDollarSolid,
  MdDashboard,
  MdDirectionsCar,
  MdInsights,
  MdOutlineAddchart,
  MdOutlineBusiness,
  MdOutlineFax,
  MdOutlineMoveToInbox,
  MdOutlineOutbox,
  MdOutlinePayments,
  RiAccountCircleLine,
  RiBillLine,
  RiBuilding4Line,
  RiClipboardLine,
  RiPieChartLine,
  RiServiceLine,
  RiSettings5Line,
  RiShieldKeyholeLine,
  RiUser2Line,
  RiUserFollowLine,
  RiUserHeartLine,
  RiUserLocationLine,
  RiUserStarLine,
  TbBuildingBank,
  TbChecklist,
  TbIdBadge2,
  TbPlug,
  TbReceiptDollar,
  TbReportMoney,
  TbUserSearch,
  TbZoomCode,
  TiFolder
}

/** The `+` quick-action every `action` entry in nav.json renders. */
export const ACTION_ICON = GoPlus
