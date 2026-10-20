// T06: demo role switcher. The identity is sent as X-Demo-User / X-Demo-Role headers.
import { DEMO_USERS } from "../api";
import type { DemoUser } from "../types";

interface RoleSwitcherProps {
  user: DemoUser;
  onChange: (u: DemoUser) => void;
}

export function RoleSwitcher({ user, onChange }: RoleSwitcherProps) {
  return (
    <label className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
      <span className="text-slate-400">Signed in as:</span>
      <div className="relative">
        <select
          data-testid="role-switcher"
          className="appearance-none rounded-lg border border-slate-700 bg-slate-800/90 pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs"
          value={user.employeeId}
          onChange={(e) => {
            const found = DEMO_USERS.find((d) => d.user.employeeId === e.target.value);
            if (found) onChange(found.user);
          }}
        >
          {DEMO_USERS.map((d) => (
            <option key={d.user.employeeId} value={d.user.employeeId} className="bg-slate-900 text-slate-200">
              {d.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </label>
  );
}

export default RoleSwitcher;
