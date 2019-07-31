import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { PortalContainer, PortalMap } from '@remirror/core';

export interface RemirrorPortalsProps {
  /**
   * Holds all the portals currently being rendered by the application.
   */
  portalContainer: PortalContainer;
}

/**
 * The component that places all the portals into the DOM.
 *
 * Portals can be created by NodeView and also the static
 * widget method on Decorations.
 */
export const RemirrorPortals = ({ portalContainer }: RemirrorPortalsProps) => {
  const [state, setState] = useState(Array.from(portalContainer.portals.entries()));

  /**
   * Update the state whenever the portal is updated.
   */
  const onPortalChange = (portalMap: PortalMap) => {
    setState(Array.from(portalMap.entries()));
  };

  useEffect(() => {
    // Auto disposed when the component un-mounts
    return portalContainer.on(onPortalChange);
  }, [portalContainer]);

  return (
    <>
      {state.map(([container, { render: Component, key }]) =>
        createPortal(
          <Portal container={container} Component={Component} portalContainer={portalContainer} />,
          container,
          key,
        ),
      )}
    </>
  );
};

export interface PortalProps extends RemirrorPortalsProps {
  /**
   * Holds the element that this portal is being rendered into.
   */
  container: HTMLElement;

  /**
   * The plain component to render.
   */
  Component: () => JSX.Element;
}

/**
 * This is the component rendered by the createPortal method within the
 * RemirrorPortals component. It is responsible for cleanup when the container
 * is removed from the DOM.
 */
const Portal = ({ portalContainer, container, Component }: PortalProps) => {
  useEffect(() => {
    /**
     * Remove the portal container entry when this portal is unmounted.
     * Portals are unmounted when their host container is removed from the dom.
     */
    return () => {
      portalContainer.remove(container);
    };
  }, [portalContainer]);

  return <Component />;
};