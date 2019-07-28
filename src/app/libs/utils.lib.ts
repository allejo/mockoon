import { EnvironmentType } from 'src/app/types/environment.type';
import { RouteResponseType } from 'src/app/types/route.type';

export const AscSort = (a, b) => {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
};

export const ArrayContainsObjectKey = (obj: { [key: string]: string }, arr: string[]) => {
  if (obj && arr) {
    return !!Object.keys(obj).find(key => arr.includes(key));
  }
  return false;
};

export const GetRouteResponseContentType = (environment: EnvironmentType, routeResponse: RouteResponseType) => {
  const routeResponseContentType = routeResponse.headers.find(header => header.key === 'Content-Type');

  if (routeResponseContentType && routeResponseContentType.value) {
    return routeResponseContentType.value;
  }

  const environmentContentType = environment.headers.find(header => header.key === 'Content-Type');

  if (environmentContentType && environmentContentType.value) {
    return environmentContentType.value;
  }

  return '';
};
