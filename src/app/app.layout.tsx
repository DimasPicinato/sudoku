import { ChevronRight, FolderGit2, Mail, Monitor, Moon, Sun, UserRound } from 'lucide-react';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { Link, Outlet } from 'react-router-dom';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useTheme } from '@/hooks/theme.hook';

export function AppLayout() {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <div className="grid min-h-[100dvh] grid-rows-[auto_1fr]">
      <header className="z-50 flex items-center justify-between gap-4 border-b p-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <h2>Sudoku Online</h2>
          </Link>

          <ChevronRight className="size-4 not-sm:hidden" />

          <NavigationMenu
            viewport={false}
            className="not-sm:hidden"
          >
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link
                    to="/projects"
                    className="flex items-center gap-2"
                  >
                    <FolderGit2 className="size-4" />
                    Projeto
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink asChild>
                    <a
                      target="_blank"
                      href="https://github.com/DimasPicinato/sudoku"
                    >
                      <div className="flex w-max items-center gap-2">
                        <SiGithub className="size-4" />
                        GitHub
                      </div>
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link
                    to="/projects"
                    className="flex items-center gap-2"
                  >
                    <UserRound className="size-4" />
                    Criador
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink asChild>
                    <a
                      target="_blank"
                      href="https://github.com/DimasPicinato"
                    >
                      <div className="flex w-max items-center gap-2">
                        <SiGithub className="size-4" />
                        DimasPicinato
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a
                      target="_blank"
                      href="https://www.linkedin.com/in/dimas-picinato"
                    >
                      <div className="flex w-max items-center gap-2">
                        <SiLinkedin className="size-4" />
                        Dimas Picinato
                      </div>
                    </a>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a
                      target="_blank"
                      href="mailto:contato@dpicinato.com"
                    >
                      <div className="flex w-max items-center gap-2">
                        <Mail className="size-4" />
                        contato@dpicinato.com
                      </div>
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center">
          <Select
            value={themeMode}
            onValueChange={setThemeMode}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">
                <Monitor />
                Sistema
              </SelectItem>
              <SelectItem value="light">
                <Sun />
                Claro
              </SelectItem>
              <SelectItem value="dark">
                <Moon />
                Escuro
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
