import WujieReact from 'wujie-react/index';

type MicroAppProps = {
  name: string;
  url: string;
  className?: string;
};

export function MicroAppContainer({ name, url, className }: MicroAppProps) {
  // return (
  //   <WujieReact
  //     name={name}
  //     url={url}
  //     sync
  //     props={{
  //       baseRouter: '/sub-app',
  //       eventBus: {
  //         onAppMounted: () => console.log(`${name} mounted`),
  //         onAppUnmounted: () => console.log(`${name} unloaded`)
  //       }
  //     }}
  //     className={className}
  //   />
  // );
}