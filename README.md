# DataPanel-FE

기업연계 SW캡스톤디자인 DataPanel FE 입니다.

## 🤝 커밋, 브랜치, 이슈 규칙 (Commit, Branch, and Issue Convention)

---

### ✉️ 커밋 규칙 (Commit Convention)

#### 커밋 태그 (Commit Tags)

| 태그 이름 | 설명 |
| :--- | :--- |
| `[chore]` | 코드 수정, 내부 파일 수정 (Code modifications, internal file changes) |
| `[feat]` | 새로운 기능 구현 (Implementing new features) |
| `[add]` | FEAT 이외의 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성 (Adding supplementary code, libraries, new files) |
| `[fix]` | 버그, 오류 해결 (Bug and error fixes) |
| `[del]` | 쓸모 없는 코드 삭제 (Deleting unnecessary code) |
| `[docs]` | README나 WIKI 등의 문서 개정 (Revising documents like README or WIKI) |
| `[move]` | 프로젝트 내 파일이나 코드의 이동 (Moving files or code within the project) |
| `[rename]` | 파일 이름 변경이 있을 때 사용 (Changing file names) |
| `[refactor]` | 전면 수정이 있을 때 사용 (Refactoring code) |

#### 커밋 형식 (Commit Format)

- **커밋 메시지**는 다음 형식을 따릅니다.



- **깃모지 사용 (Using Gitmoji)**
- 가독성을 높이기 위해 커밋 메시지 앞에 깃모지를 사용합니다.

- **PR 요청 (Pull Request)**
- 모든 테스트를 통과한 후에만 Pull Request를 요청합니다.

---

### 🌴 브랜치 규칙 (Branch Convention)

#### 메인 브랜치 (Main Branch)

- **`main`**
- 항상 배포 가능한 상태를 유지해야 합니다.
- **직접 커밋을 금지합니다. 🔥**

#### 개발 브랜치 (Develop Branch)

- **`develop`**
- 다음 배포 버전을 준비하는 브랜치입니다.
- 새로운 기능과 버그 수정을 위한 기본 브랜치로 사용됩니다.

#### 기능 브랜치 (Feature Branch)

- **`feature/#이슈번호-기능이름`**
- 새로운 기능을 개발할 때 사용하는 브랜치입니다.
- 예: `feature/#12-login-page`

#### 버그 수정 브랜치 (Fix Branch)

- **`fix/#이슈번호-버그이름`**
- 버그를 수정할 때 사용하는 브랜치입니다.
- 예: `fix/#25-auth-error`

#### 브랜치 병합 (Branch Merging)

- **PR (Pull Request)** 을 통해서만 병합합니다.
- 테스트를 통과한 브랜치는 `develop` 브랜치에 병합 후, 삭제합니다.

---

### 🛠️ 이슈 규칙 (Issue Convention)

#### 이슈 제목 (Issue Title)

- 간결하고 명확하게 작성합니다.
- 예: `로그인 페이지 API 연동 오류`

#### 이슈 내용 (Issue Content)

- 상세한 내용, 재현 방법, 마감 기한 등을 포함하여 자세하게 작성합니다.

#### 이슈 닫기 (Closing Issues)

- 해당 이슈가 해결되면 PR과 함께 이슈를 닫습니다.
- 커밋 메시지에 `close #이슈번호` 또는 `fix #이슈번호` 와 같은 키워드를 사용하여 자동으로 닫히게 할 수 있습니다.
- 예: `fix: 로그인 API 오류 해결 (close #42)`
