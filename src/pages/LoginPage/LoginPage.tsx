import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import 스타일
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 로그인 처리
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setIsLoading(true);
        setError('');

        // 로그인 시도
        try {
            // 임시 로그인 로직 (이후 api 호출로 교체하기)
            await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

            // 임시 검증
            if (email === 'admin@example.com' && password === 'password') {
                localStorage.setItem('authToken', 'dummy-token-123');
                localStorage.setItem('userEmail', email);

                // 대시보드로 nativate
                navigate('/dashboard');
            } else {
                setError('이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해주세요.');
            }
        } catch (err) {
            setError('로그인 중 오류가 발생하였습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>

            <div className={styles.loginContainer}>
                <div className={styles.loginContainer__box}>
                    <div className={styles.loginContainer__header}>
                        <h1 className={styles.loginContainer__title}>관리자 로그인</h1>
                        <p>DataPanel 관리 시스템에 로그인하세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        <div className={styles.loginForm__group}>
                            <label className={styles.loginForm__label}>이메일</label>
                            <input
                                className={styles.loginForm__input}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div className={styles.loginForm__group}>
                            <label className={styles.loginForm__label}>비밀번호</label>
                            <input
                                className={styles.loginForm__input}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="password"
                            />
                        </div>

                        {error && (
                            <div className={styles.loginContainer__error}>
                                {error}
                            </div>
                        )}

                        <button
                            type='submit'
                            className={styles.loginForm__button}
                            disabled={isLoading}
                        >
                            {isLoading ? '로그인 중' : '로그인'}
                        </button>
                    </form>

                    { /* api 연결 후, 삭제 예정 */}
                    <div className={styles.loginContainer__footer}>
                        <p>테스트 계정: admin@example.com / password</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;