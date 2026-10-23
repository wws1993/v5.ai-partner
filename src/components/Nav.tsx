import { useState } from 'react'
import classNames from 'classnames'

type NavKey = 'message' | 'talent' | 'company' | 'contacts' | 'me'

const NAV_ITEMS: { key: NavKey; label: string; icon: string }[] = [
  { key: 'message', label: '消息', icon: '/imgs/nav/message.svg' },
  { key: 'talent', label: '人才', icon: '/imgs/nav/talent.svg' },
  { key: 'company', label: '公司', icon: '/imgs/nav/company.svg' },
  { key: 'contacts', label: '通讯录', icon: '/imgs/nav/contacts.svg' },
  { key: 'me', label: '我的', icon: '/imgs/nav/me.svg' },
]

function NavIcon({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={classNames(['bg-current', className])}
      style={{
        maskImage: `url(${src})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

export function Nav() {
  const [active, setActive] = useState<NavKey>('message')

  return (
    <nav
      className={classNames([
        'absolute flex border border-white/30 bg-[#464b66]/30 p-1 rounded-[34px]',
        // mobile：底部横向
        'bottom-3 left-1/2 -translate-x-1/2 w-[351px] max-w-[calc(100vw-24px)] h-16 flex-row',
        // pc：右侧纵向
        'md:left-[-84px] md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0',
        'md:w-[60px] md:h-[416px] md:max-w-none md:flex-col md:gap-3',
      ])}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setActive(item.key)}
            className={classNames([
              'flex flex-col items-center justify-center font-sans cursor-pointer',
              'flex-1 h-14 px-4 py-2 gap-0.5',
              'md:flex-none md:w-[52px] md:h-[72px] md:p-4 md:gap-1',
              isActive
                ? 'rounded-[36px] bg-white text-nav-active'
                : 'rounded-2xl bg-transparent text-white',
            ])}
          >
            <NavIcon
              src={item.icon}
              className="size-6 shrink-0 md:size-5"
            />
            <span className="whitespace-nowrap text-xs leading-[14px] md:text-sm md:leading-4">
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
