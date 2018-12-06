# nestjs-common
In this repo you will find a lot of the base shared code that we will user throughout all of our NestJS projects. Some of these common modules that we have bundled are:
 - TryCatch Decorators
 - HTTP Filters
 - Authentication Gaurds
 - Common Exceptions
 - Error Handling Service
 - Pagination Classes
 - Validation Pipes
 - Redis Service

## Installation
```
npm i @teamhive/nestjs-common
```

From there just add whatever you want to import into your Core/Common Modules

## Peer Dependencies
There are several peer dependencies of this project. Once you install this package you will need to follow up and ensure the follow dependencies are installed:

```
npm i @nestjs/common@^5.0 @nestjs/core@^5.0 @nestjs/testing@^5.0 class-validator@~0.9.0 config@^3.0 js-yaml@^3.0 log4js@^3.0 raven@^2.0 reflect-metadata@^0.1 rxjs@^6.0
```

## Dev Dependencies
There are also a few dev dependencies that you may want to add in order for typescript to compile correctly:

```
npm i --save-dev @types/config @types/raven
```

## Configurations
There are several configurations that we use throughout our projects. Some of them are required by this package. Here is what you should add into the default config file (https://www.npmjs.com/package/config)

```
port: 8080

apiPrefix: '/api'

raven:
    dsn: 'htttps://logger.sentry.io/31'

session:
    accessExpiration: 86400000 # ms - 24 hour
    accessCookie:
        name: 'access_token'
        options:
            httpOnly: true
            maxAge: 86400000 # ms - 24 hour
            secure: true

passport:
    verifyUser: 'verify-user'
    verifySso: 'verify-sso'

logger:
    level: 'debug'

redis:
    host: 'localhost'
    keyPrefix: 'app_name_'
    expiration: 86400000 # ms - 24 hours
```

## Available Modules

### Decorators
There are a few different decorators that we have made available:
#### @TryCatch(error: Error, options?: { customResponseMessage: string } )
This decorator will wrap your whole function into a try/catch and you can pass an optional custom error class for it to throw!

```
    @TryCatch(SqlException)
    async fetchAll() {
        return await this.usersRepository.fetchAll()
    }
```

#### @QueryUser()
This decorator will pull out the query parameters and the req.user object and inject them into the DTO

```
    async fetchAll(@QueryUser() query: FetchAllPgDto) {
        return await this.usersRepository.fetchAll(query)
    }
```

#### @User()
This decorator will pull out the req.user object and make them available in the method

```
    async fetchAll(@User() user: AuthorizedUser) {
        return await this.usersRepository.fetchAll(user)
    }
```

#### @Permissions()
This decorator will typically be used in tandom with the PermissionsGuard so that you can ensure the route is protected based on certain permissions

```
    @Permissions('CONTENT_VIEW')
    @UseGuards(IsLoggedInGuard, PermissionsGuard)
    @Get()
    async fetchAll(@Query() query: ContentFetchAllPgDto) {
        const content = await this.contentService.fetchAll(query);

        return new ContentFetchAllAndCount(content);
    }
```

### Data Transfer Objects (Dtos)
#### Pagination
This class is our standard that we use for pagination requests. You will want to extend this class for your custom pagination classes

```
export class UserFetchAllPgDto extends Pagination {
    @IsOptional()
    @IsString()
    @IsIn(['firstName', 'lastName'])
    sortBy: string;

    @ValidateNested()
    filter: UserFetchAllFilter;

    constructor(pagination: PaginationOptions = {}) {
        super('firstName', pagination);

        try {
            this.filter = new UserFetchAllFilter(JSON.parse(decodeURI(pagination.filter)));
        }
        catch (e) {
            this.filter = new UserFetchAllFilter();
        }

        this.search = new Search(UserSearch, pagination.search).include || null;
    }
}
```

## Distribution
```
npm pack
npm version (major|minor|patch)
npm publish
```

_Note: This will also automatically push changes and tags post-publish_