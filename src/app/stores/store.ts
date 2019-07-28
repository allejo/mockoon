import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { SettingsType } from 'src/app/services/settings.service';
import { Toast } from 'src/app/services/toasts.service';
import { environmentReducer, ReducerActionType } from 'src/app/stores/reducer';
import { EnvironmentsType, EnvironmentType } from 'src/app/types/environment.type';
import { RouteResponseType, RouteType } from 'src/app/types/route.type';
import { EnvironmentLogsType } from 'src/app/types/server.type';

export type ViewsNameType = 'ROUTE' | 'ENV_SETTINGS' | 'ENV_LOGS';

export type TabsNameType = 'RESPONSE' | 'HEADERS'/*  | 'ENV_SETTINGS' | 'ENV_LOGS' */;

export type EnvironmentStatusType = { running: boolean, needRestart: boolean };

export type EnvironmentsStatusType = { [key: string]: EnvironmentStatusType };

export type DuplicatedRoutesTypes = { [key: string]: Set<string> };

export type StoreType = {
  activeTab: TabsNameType;
  activeView: ViewsNameType;
  activeEnvironmentUUID: string;
  activeRouteUUID: string;
  activeRouteResponseUUID: string;
  environments: EnvironmentsType;
  environmentsStatus: EnvironmentsStatusType;
  bodyEditorConfig: any;
  duplicatedEnvironments: Set<string>;
  duplicatedRoutes: DuplicatedRoutesTypes;
  environmentsLogs: EnvironmentLogsType;
  toasts: Toast[];
  userId: string;
  settings: SettingsType;
};

@Injectable({ providedIn: 'root' })
export class Store {
  private store$ = new BehaviorSubject<StoreType>({
    activeView: 'ROUTE',
    activeTab: 'RESPONSE',
    activeEnvironmentUUID: null,
    activeRouteUUID: null,
    activeRouteResponseUUID: null,
    environments: [],
    environmentsStatus: {},
    bodyEditorConfig: {
      options: {
        fontSize: '1rem',
        wrap: 'free',
        showPrintMargin: false,
        tooltipFollowsMouse: false,
        useWorker: false
      },
      mode: 'json',
      theme: 'custom_theme'
    },
    duplicatedEnvironments: new Set(),
    duplicatedRoutes: {},
    environmentsLogs: {},
    toasts: [],
    userId: null,
    settings: null
  });

  constructor() { }

  /**
   * Select store element
   */
  public select<T extends keyof StoreType>(path: T): Observable<StoreType[T]> {
    return this.store$.asObservable().pipe(
      pluck(path)
    );
  }

  /**
   * Get any store item
   */
  public get<T extends keyof StoreType>(path: T): StoreType[T] {
    return this.store$.value[path];
  }

  /**
   * Select active environment observable
   */
  public selectActiveEnvironment(): Observable<EnvironmentType> {
    return this.store$.asObservable().pipe(
      map(store => store.environments.find(environment => environment.uuid === this.store$.value.activeEnvironmentUUID))
    );
  }

  /**
   * Select active environment status observable
   */
  public selectActiveEnvironmentStatus(): Observable<EnvironmentStatusType> {
    return this.store$.asObservable().pipe(
      map(store => store.environmentsStatus[this.store$.value.activeEnvironmentUUID])
    );
  }

  /**
   * Select active route observable
   */
  public selectActiveRoute(): Observable<RouteType> {
    return this.store$.asObservable().pipe(
      map(store => store.environments.find(environment => environment.uuid === this.store$.value.activeEnvironmentUUID)),
      map(environment => environment ? environment.routes.find(route => route.uuid === this.store$.value.activeRouteUUID) : null)
    );
  }

  /**
   * Select active route response observable
   */
  public selectActiveRouteResponse(): Observable<RouteResponseType> {
    return this.store$.asObservable().pipe(
      map(store => store.environments.find(environment => environment.uuid === this.store$.value.activeEnvironmentUUID)),
      map(environment => environment ? environment.routes.find(route => route.uuid === this.store$.value.activeRouteUUID) : null),
      map(route => route ? route.responses.find(routeResponse => routeResponse.uuid === this.store$.value.activeRouteResponseUUID) : null)
    );
  }

  /**
   * Get environment by uuid
   */
  public getEnvironmentByUUID(UUID: string): EnvironmentType {
    return this.store$.value.environments.find(environment => environment.uuid === UUID);
  }

  /**
   * Get active environment value
   */
  public getActiveEnvironment(): EnvironmentType {
    return this.store$.value.environments.find(environment => environment.uuid === this.store$.value.activeEnvironmentUUID);
  }

  /**
   * Get active route observable
   */
  public getActiveRoute(): RouteType {
    return this.store$.value.environments
      .find(environment => environment.uuid === this.store$.value.activeEnvironmentUUID).routes
      .find(route => route.uuid === this.store$.value.activeRouteUUID);
  }

  /**
   * Get active route response observable
   */
  public getActiveRouteResponse(): RouteResponseType {
    return this.store$.value.environments
      .find(environment => environment.uuid === this.store$.value.activeEnvironmentUUID).routes
      .find(route => route.uuid === this.store$.value.activeRouteUUID).responses
      .find(response => response.uuid === this.store$.value.activeRouteResponseUUID);
  }

  /**
   * Update the store using the reducer
   */
  public update(action: ReducerActionType) {
    this.store$.next(environmentReducer(this.store$.value, action));
  }
}
