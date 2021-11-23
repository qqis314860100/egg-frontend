import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConfigProvider } from 'zarm';
import { useLocation } from 'react-router';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import NavBar from './components/NavBar';
import routes from './router';

function App() {
  // 想要在函数组件内使用useLocation，该组件必须被Router高阶组件包裹
  const { pathname } = useLocation();

  const needNav = ['/', '/data', '/user'];
  const [showNav, setShowNav] = useState(false);
  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]);
  return (
    <>
      <ConfigProvider locale={zhCN} primaryColor={'#007fff'}>
        <Switch>
          {routes.map((route) => {
            console.log(route);
            return (
              <Route exact key={route.path} path={route.path}>
                <route.component />
              </Route>
            );
          })}
        </Switch>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  );
}

export default App;
