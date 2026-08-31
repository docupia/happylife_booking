export const locales = ["en", "ko"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ko";
}

export const dictionaries = {
  en: {
    common: {
      account: "Account",
      admin: "Admin",
      approve: "Approve after deposit",
      backToClasses: "Back to classes",
      booking: "Booking",
      bookings: "Bookings",
      capacity: "Capacity",
      class: "Class",
      classes: "Classes",
      close: "Close",
      closed: "Closed",
      confirmed: "confirmed",
      create: "Create",
      email: "Email",
      expireDate: "Expire date",
      expires: "Expires",
      fullName: "Full name",
      guide: "Guide",
      language: "Language",
      left: "left",
      live: "Live",
      location: "Location",
      login: "Login",
      note: "Note",
      okGoToLogin: "OK, go to login",
      open: "Open",
      openingSoon: "Opening Soon",
      password: "Password",
      pending: "pending",
      processing: "Processing...",
      saveChanges: "Save changes",
      signIn: "Sign in",
      signingIn: "Signing in...",
      signOut: "Sign out",
      signingOut: "Signing out...",
      signUp: "Sign up",
      signingUp: "Signing up...",
      status: "Status",
      student: "Student",
      summary: "Summary",
      title: "Title",
    },
    home: {
      applying: "Sending request...",
      addSupabase:
        "Add Supabase environment variables to enable login, booking, and admin management.",
      bookingCancelled: "Booking request cancelled.",
      bookingReceived:
        "Booking request received. Please wait for admin approval after deposit confirmation.",
      bookedDate: "Booked",
      cancelBooking: "Cancel Booking",
      cancelingBooking: "Cancelling...",
      classCalendar: "Open Class Calendar",
      classDate: "Class",
      malaysiaTime: "Malaysia time",
      nextMonth: "Next month",
      noOpenClasses: "No open classes right now.",
      notAvailable: "Not Available",
      previousMonth: "Previous month",
      bookingPending: "Booking request is pending approval.",
      previewMode: "Preview mode",
      requestBooking: "Request Booking",
      seatConfirmed: "Your seat is confirmed.",
      signedInAs: "Signed in as",
      signInToBook: "Sign in to book",
      transferGuide:
        "Please wait for admin approval after deposit confirmation.",
    },
    guide: {
      title: "Class Guide",
      rulesTitle: "📌 Happy Life Participation Rules",
      approvalTitle:
        "Approval criteria when booking requests exceed class capacity",
      rules: {
        one: "Class starts exactly at 8:30 AM. Please arrive before class begins.",
        two:
          "Please avoid leaving in the middle of class so the session can run smoothly.",
        three:
          "If you must leave early, please send a message in advance.",
        four:
          "If you cannot attend a Monday, Wednesday, or Friday class, please cancel 2 to 3 days in advance so another member can take the spot.",
      },
      approvalCriteria: {
        one:
          "When requests exceed capacity, members who participate consistently and follow class rules well will be approved first.",
        two:
          "Members with no-shows or frequent cancellations may be placed lower in priority for the next class approval.",
      },
    },
    auth: {
      alreadyHaveAccount: "Already have an account? Sign in",
      atLeastCharacters: "At least 6 characters",
      checkEmail: "Check your email",
      createAndStart: "Create an account and start booking right away.",
      createAccount: "Create account",
      emailConfirmationStillEnabled:
        "Account created, but Supabase email confirmation is still enabled. Please ask the administrator to disable Confirm Email, then sign in again.",
      newMember: "New member? Create account",
      sessionExpired:
        "Your session expired after 2 hours of inactivity. Please sign in again.",
      signedOut: "You have been signed out.",
      supabaseRequired:
        "Supabase environment variables are required before authentication can run.",
      useSameLogin:
        "Use the same login for class bookings and admin management.",
      welcomeBack: "Welcome back",
      yourName: "Your name",
    },
    admin: {
      accessDenied: "Access denied",
      accessLimited: "Admin access is limited to {email}.",
      adminLogin: "Admin Login",
      approving: "Approving...",
      classCreated: "Class created.",
      classUpdated: "Class updated.",
      connectSupabase:
        "Connect Supabase environment variables and apply the migration before using admin management.",
      createClass: "Create Class",
      creatingClass: "Creating class...",
      editClass: "Edit class",
      manageIntro:
        "Sign in with {email} to manage classes, bookings, and students.",
      management: "Management",
      noBookings: "No bookings yet.",
      noClasses: "No {status} classes.",
      pendingDeposit:
        "{count} booking request needs deposit confirmation.",
      savingClass: "Saving class...",
      startsAt: "Starts at",
      studentList: "Student List",
      students: "Students",
      supabaseRequired: "Supabase required",
    },
    pwa: {
      addHome: "Add it to your home screen for faster class booking.",
      dismissInstall: "Dismiss install prompt",
      install: "Install",
      installing: "Installing...",
      installTitle: "Install HappyLife",
    },
  },
  ko: {
    common: {
      account: "계정",
      admin: "관리자",
      approve: "입금 확인 후 승인",
      backToClasses: "클래스 목록으로 돌아가기",
      booking: "예약",
      bookings: "예약",
      capacity: "정원",
      class: "클래스",
      classes: "클래스",
      close: "닫기",
      closed: "마감",
      confirmed: "확정",
      create: "생성",
      email: "이메일",
      expireDate: "만료일",
      expires: "만료",
      fullName: "이름",
      guide: "가이드",
      language: "언어",
      left: "남음",
      live: "실시간",
      location: "장소",
      login: "로그인",
      note: "메모",
      okGoToLogin: "확인하고 로그인으로 이동",
      open: "오픈",
      openingSoon: "오픈예정",
      password: "비밀번호",
      pending: "대기",
      processing: "처리 중...",
      saveChanges: "변경 저장",
      signIn: "로그인",
      signingIn: "로그인 중...",
      signOut: "로그아웃",
      signingOut: "로그아웃 중...",
      signUp: "가입하기",
      signingUp: "가입 중...",
      status: "상태",
      student: "수강생",
      summary: "개요",
      title: "제목",
    },
    home: {
      applying: "신청 처리 중...",
      addSupabase:
        "로그인, 예약, 관리자 기능을 사용하려면 Supabase 환경 변수를 추가하세요.",
      bookingCancelled: "예약 신청이 취소되었습니다.",
      bookingReceived:
        "예약 신청이 접수되었습니다. 입금 안내 후 관리자 승인을 기다려주세요.",
      bookedDate: "예약됨",
      cancelBooking: "예약 취소",
      cancelingBooking: "취소 처리 중...",
      classCalendar: "오픈 클래스 달력",
      classDate: "클래스",
      malaysiaTime: "말레이시아 시간",
      nextMonth: "다음 달",
      noOpenClasses: "현재 오픈된 클래스가 없습니다.",
      notAvailable: "예약 불가",
      previousMonth: "이전 달",
      bookingPending: "예약 신청이 승인 대기 중입니다.",
      previewMode: "미리보기 모드",
      requestBooking: "예약 신청",
      seatConfirmed: "좌석이 확정되었습니다.",
      signedInAs: "로그인 계정",
      signInToBook: "로그인 후 예약",
      transferGuide:
        "입금 후 관리자 승인까지 기다려주세요. 입금 확인 후 예약이 확정됩니다.",
    },
    guide: {
      title: "클래스 참여 가이드",
      rulesTitle: "📌 Happy Life 참여 규칙",
      approvalTitle:
        "예약 앱 신청 인원이 정원보다 많을 경우 승인 기준",
      rules: {
        one: "수업은 오전 8:30 정시 시작입니다. 수업 전에 도착해 주세요.",
        two: "원활한 수업 진행을 위해 중간 퇴실은 자제해 주세요.",
        three:
          "부득이하게 먼저 나가야 할 경우 미리 메시지 부탁드립니다.",
        four:
          "월·수·금 수업 중 참여가 어려운 날이 있다면 2~3일 전에 취소해 주세요. 다른 회원에게 참여 기회를 드릴 수 있습니다.",
      },
      approvalCriteria: {
        one:
          "정원 초과 시 꾸준히 참여하고 수업 규칙을 잘 지키는 회원을 우선 승인합니다.",
        two:
          "무단 불참 또는 잦은 취소가 있을 경우 다음 수업 승인 시 후순위로 배정될 수 있습니다.",
      },
    },
    auth: {
      alreadyHaveAccount: "이미 계정이 있나요? 로그인",
      atLeastCharacters: "6자 이상 입력",
      checkEmail: "이메일을 확인해주세요",
      createAndStart: "계정을 만들고 바로 예약을 시작하세요.",
      createAccount: "계정 만들기",
      emailConfirmationStillEnabled:
        "계정은 생성되었지만 Supabase 이메일 인증 설정이 아직 켜져 있습니다. 관리자가 Confirm Email을 끈 뒤 다시 로그인해주세요.",
      newMember: "처음이신가요? 회원가입",
      sessionExpired:
        "2시간 동안 사용하지 않아 로그아웃되었습니다. 다시 로그인해주세요.",
      signedOut: "로그아웃되었습니다.",
      supabaseRequired:
        "인증 기능을 사용하려면 Supabase 환경 변수가 필요합니다.",
      useSameLogin:
        "클래스 예약과 관리자 메뉴에서 같은 계정을 사용합니다.",
      welcomeBack: "다시 오신 것을 환영합니다",
      yourName: "이름을 입력하세요",
    },
    admin: {
      accessDenied: "접근 권한 없음",
      accessLimited: "관리자 접근은 {email} 계정만 가능합니다.",
      adminLogin: "관리자 로그인",
      approving: "승인 처리 중...",
      classCreated: "클래스가 생성되었습니다.",
      classUpdated: "클래스가 수정되었습니다.",
      connectSupabase:
        "관리자 기능을 사용하려면 Supabase 환경 변수와 마이그레이션 적용이 필요합니다.",
      createClass: "클래스 생성",
      creatingClass: "클래스 생성 중...",
      editClass: "클래스 수정",
      manageIntro:
        "클래스, 예약, 수강생을 관리하려면 {email} 계정으로 로그인하세요.",
      management: "관리",
      noBookings: "예약자가 아직 없습니다.",
      noClasses: "{status} 클래스가 없습니다.",
      pendingDeposit: "입금 확인이 필요한 예약 신청 {count}건이 있습니다.",
      savingClass: "클래스 저장 중...",
      startsAt: "시작 시간",
      studentList: "예약자 명단",
      students: "수강생",
      supabaseRequired: "Supabase 설정 필요",
    },
    pwa: {
      addHome: "홈 화면에 추가하면 더 빠르게 예약할 수 있습니다.",
      dismissInstall: "설치 안내 닫기",
      install: "설치",
      installing: "설치 중...",
      installTitle: "HappyLife 설치",
    },
  },
} as const;

type WidenStrings<T> = T extends string
  ? string
  : {
      [K in keyof T]: WidenStrings<T[K]>;
    };

export type Dictionary = WidenStrings<(typeof dictionaries)["en"]>;

export function getDictionary(locale: Locale = "en"): Dictionary {
  return dictionaries[locale];
}

export function interpolate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
