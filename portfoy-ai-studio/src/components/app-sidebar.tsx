import { useContext, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { LayoutDashboard, Wallet, TrendingUp, Shield, Settings, LogOut, Moon, Sun, User, Bell, Database, ChevronRight } from 'lucide-react'
import { signOut } from '../lib/api'
import { ThemeContext } from '../context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AppSidebarProps {
  user: any
  profile: any
  currentView: string
  currentSettingsTab?: string
  setView: (v: 'dashboard' | 'assets' | 'settings' | 'bes' | 'passive-income' | 'admin') => void
  setSettingsTab?: (tab: string) => void
}

export function AppSidebar({ user, profile, currentView, currentSettingsTab, setView, setSettingsTab }: AppSidebarProps) {
  const theme = useContext(ThemeContext)
  const [settingsOpen, setSettingsOpen] = useState(currentView === 'settings')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Wallet },
    { id: 'passive-income', label: 'Pasif Gelir', icon: TrendingUp },
    { id: 'bes', label: 'Devlet Katkısı', icon: Shield },
  ]

  const settingsSubItems = [
    { id: 'portfolios', label: 'Portfolios', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
  ]

  const adminItems = user && (user.role === 'admin' || user.role === 'superadmin')
    ? [{ id: 'admin', label: 'Admin', icon: Shield }]
    : []

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => setView('dashboard')}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-800 text-white">
                <TrendingUp className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold text-slate-900 dark:text-white">FinTrack</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setView(item.id as any)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <Collapsible 
                open={settingsOpen || currentView === 'settings'} 
                onOpenChange={setSettingsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={currentView === 'settings'}>
                      <Settings className="size-4" />
                      <span>Settings</span>
                      <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton 
                            onClick={() => {
                              setView('settings')
                              if (setSettingsTab) setSettingsTab(subItem.id)
                            }}
                            isActive={currentView === 'settings' && currentSettingsTab === subItem.id}
                          >
                            <subItem.icon className="size-4" />
                            <span>{subItem.label}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {adminItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setView(item.id as any)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={theme?.toggleTheme}>
              {theme?.isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span>{theme?.isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => signOut()}>
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="size-8">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName || user.email} />
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium text-slate-900 dark:text-white">{user.user_metadata?.full_name || user.email}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{profile?.baseCurrency || 'USD'}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}