export const Endpoints = {
    home: {
        landing: '/',
    },
    auth: {
        signin: '/auth/sign-in',
        signup: '/auth/sign-up',
        forgotPassword: '/auth/forgot-password',
    },
    error: {
        forbidden: '/error/403',
        notFound: '/error/404',
        internalServer: '/error/500',
    },
    classroom: {
        root: (role) => `/${role}/classroom`,
        assignment: (role, classroomId) => `/${role}/classroom/${classroomId}/assignment`,
        member: (role, classroomId) => `/${role}/classroom/${classroomId}/member`,
    },
    assignment: {
        domain: "/6-assignment",
        content: "/content",
        history: "/submission-history",
        attachedClassroom: "/attached-5-classroom",
        root: (role) => `/${role}/assignment`,
        create: (role) => `/${role}/assignment/create`,
    },
    admin: {
        userManagement: '/admin/3-user',
        classroomDashboard: '/admin/dashboard',
    },
    user: {
        myProfile: '/3-user/my-profile',
        getProfile: (id) => `/user/${id}`,
    }
};