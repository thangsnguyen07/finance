'use client';

import { cn } from '@heroui/react';

import {
  IconBox,
  type IconBoxShape,
  type IconBoxSize,
  type IconBoxTone,
} from './IconBox';
import { Row } from './Layout';
import { Text } from './Text';

import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';

export interface ListItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  icon?: LucideIcon;
  iconNode?: ReactNode;
  iconTone?: IconBoxTone;
  iconShape?: IconBoxShape;
  iconSize?: IconBoxSize;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  trailing?: ReactNode;
  trailingSubtitle?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  hoverable?: boolean;
}

export function ListItem({
  icon: Icon,
  iconNode,
  iconTone = 'neutral',
  iconShape = 'circle',
  iconSize = 'md',
  title,
  subtitle,
  badge,
  trailing,
  trailingSubtitle,
  action,
  compact = false,
  hoverable = false,
  className,
  ...props
}: ListItemProps) {
  return (
    <Row
      justify="between"
      gap="md"
      className={cn(
        'group transition-colors',
        compact ? 'py-2.5' : 'px-5 py-3.5',
        hoverable && 'hover:bg-surface-secondary/20',
        className,
      )}
      {...props}
    >
      <Row gap="md" className="min-w-0">
        {Icon ? (
          <IconBox tone={iconTone} shape={iconShape} size={iconSize}>
            <Icon
              className={iconSize === 'lg' ? 'h-5 w-5 stroke-[2]' : 'h-4 w-4'}
            />
          </IconBox>
        ) : iconNode ? (
          iconNode
        ) : null}

        <div className="min-w-0">
          <Row gap="sm" wrap>
            <Text variant="subtitle" truncate>
              {title}
            </Text>
            {badge}
          </Row>
          {subtitle ? (
            <Row gap="xs" wrap className="mt-0.5 text-[11px] text-muted">
              {subtitle}
            </Row>
          ) : null}
        </div>
      </Row>

      <Row gap="sm" className="shrink-0 text-right">
        {trailing || trailingSubtitle ? (
          <div>
            {trailing ? <div>{trailing}</div> : null}
            {trailingSubtitle ? (
              <Text
                as="p"
                variant="mono"
                tone="muted"
                className="mt-0.5 text-[10px]"
              >
                {trailingSubtitle}
              </Text>
            ) : null}
          </div>
        ) : null}
        {action}
      </Row>
    </Row>
  );
}
