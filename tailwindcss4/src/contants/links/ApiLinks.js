const BASE_API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

const ApiGroups = {
    auth: '/auth',
    classroom: '/5-classroom',
    user: '/3-user',
    assignment: '/6-assignment',
    submission: '/submission',
}

const buildUrl = (group, path = '') => `${BASE_API_URL}${ApiGroups[group]}${path}`;

export const ApiLinks = {
    auth: {
        signin: buildUrl('auth', '/signin'),
        signup: buildUrl('auth', '/signup'),
        signout: buildUrl('auth', '/signout'),
        forgotPassword: buildUrl('auth', '/forgot'),
        refreshToken: buildUrl('auth', '/token/refresh'),
    },
    classroom: {
        all: buildUrl('classroom', '/all'),
        byId: (classroomId) => buildUrl('classroom', classroomId ? `/${classroomId}` : ""),
    },
    classroomMember: {
        root: (classroomId) => buildUrl('classroom', `/${classroomId}/member`),
        all: (classroomId) => buildUrl('classroom', `/${classroomId}/member/all`),
        getById: (classroomId, memberId) => buildUrl('classroom', `/${classroomId}/member/${memberId}`),
        leave: (classroomId) => buildUrl('classroom', `/${classroomId}/member/me`),
        join: (classroomId) => buildUrl('classroom', `/${classroomId}/member/join`),
    },
    classroomAssignment: {
        root: (classroomId) => buildUrl('classroom', `/${classroomId}/assignment`),
        all: (classroomId) => buildUrl('classroom', `/${classroomId}/assignment/all`),
        getById: (classroomId, assignmentId) => buildUrl('classroom', `/${classroomId}/assignment/${assignmentId}`),
    },

    user: {
        root: buildUrl('user'),
        all: buildUrl('user', '/all'),
        count: buildUrl('user', '/count'),
        myProfile: buildUrl('user', '/me'),
        myPassword: buildUrl('user', '/me/password'),
        byId: (id) => buildUrl('user', `/${id}`),
        search: (keyword) => buildUrl('user', `?keyword=${keyword}`),
    },

    assignment: {
        root: buildUrl('assignment'),
        all: buildUrl('assignment', '/all'),
        byId: (assignmentId) => buildUrl('assignment', assignmentId ? `/${assignmentId}` : ""),
        submissionAll: (assignmentId) => buildUrl('submission', `/assignment/${assignmentId}/all`),
        questionList: (assignmentId) => buildUrl('assignment', `/${assignmentId}/question`),
        attachedClassroom: (assignmentId) => buildUrl('assignment', `/${assignmentId}/classroom/all`),
        attachedInfo: (assignmentId, classroomId) => buildUrl('assignment', `/${assignmentId}/classroom/${classroomId}`),
        attach: buildUrl('assignment', `/attach`),
    },

    submission: {
        assignmentClassroomAll: (classroomId, assignmentId) => buildUrl('submission', `/classroom/${classroomId}/assignment/${assignmentId}/all`),
        detailsById: (id) => buildUrl('submission', `/${id}/details`),
        infoById: (id) => buildUrl('submission', `/${id}`),
        start: buildUrl('submission', `/start`),
        submit: buildUrl('submission', `/submit`),
    }
};