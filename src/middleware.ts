import { MiddlewareConfig, NextRequest, NextResponse } from "next/server"

const publicRoutes = [
    {path: '/sign-in', whenauthenticated: 'redirect'},
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in'

export function middleware(request :NextRequest) {
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('authCookie')

    if(!authToken && publicRoute) {
        return NextResponse.next()
    }

    if(!authToken && !publicRoute) {
        
        const redirectUrl = request.nextUrl.clone()

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirectUrl)
    }

    if(authToken && publicRoute && publicRoute.whenauthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone()

        redirectUrl.pathname = '/'

        return NextResponse.redirect(redirectUrl)
    }

    if(authToken && !publicRoute) {
        // Checar se o JWT não está EXPIRADO
        // Se sim, remover o cookie e redirecionar o usuário para o login
        // Aplicar uma estratégia de refreshToken (não aplicar aqui, aplicar no app)

        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config :MiddlewareConfig = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      ]
}