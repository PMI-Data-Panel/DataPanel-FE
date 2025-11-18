const Team = () => {
  return (
    <>
      <section
        id="team"
        className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gray-50 w-full max-w-full overflow-x-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-10 lg:mb-12">
            Team 개발냄새 🐾
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                name: "영호",
                role: "백앤드",
                dept: "모바일소프트웨어트랙 & 웹공학트랙",
              },
              {
                name: "창수",
                role: "백앤드",
                dept: "모바일소프트웨어트랙 & 웹공학트랙",
              },
              {
                name: "달현",
                role: "백앤드",
                dept: "모바일소프트웨어트랙 & 웹공학트랙",
              },
              {
                name: "지원",
                role: "백앤드",
                dept: "웹공학트랙 & 모바일소프트웨어트랙",
              },
              {
                name: "민서",
                role: "프론트",
                dept: "웹공학트랙 & 모바일소프트웨어트랙",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 md:p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                  {member.name}
                </div>
                <h3 className="text-base md:text-lg font-bold mb-1">
                  {member.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-1">
                  {member.role}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  {member.dept}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;
