'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/app/lib/utils';

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

// const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

// const DrawerOverlay = React.forwardRef<
//   React.ElementRef<typeof DrawerPrimitive.Overlay>,
//   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
// >(({ className, ...props }, ref) => (
//   <DrawerPrimitive.Overlay
//     ref={ref}
//     className={cn('fixed z-50', className)}
//     {...props}
//   />
// ));
// DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    // <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'z-[999999] h-auto bg-gray-100 fixed bottom-44 right-[22%] dark:bg-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  // {/* // </DrawerPortal> */}
));
DrawerContent.displayName = 'DrawerContent';





export {
  Drawer,
  // DrawerPortal,
  // DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
};
