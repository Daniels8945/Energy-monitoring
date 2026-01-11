import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";
// import { camelCase } from "lodash";
import { camelCase } from "change-case";


export const CustomInput = forwardRef(
  function CustomInput(props, ref) {
    const {
    //   after,
      placeholder,
      type,
      className,
      label = "",
      labelClassName = "",
      containerClassName = "",
      error,
      errorClassName,
      optional,
    //   icon,
      ...rest
    } = props;
    const inputId = camelCase(label);


    return (
      <div className={twMerge("", containerClassName)}>
        {label ? (
          <label
            className={twMerge(
              "text-sm font-semibold text-foreground leading-[24px] mb-2 block",
              labelClassName
            )}
            htmlFor={inputId}
          >
            {label}{" "}
            {optional && (
              <span className="not-italic text-sm text-[#333]">(optional)</span>
            )}
          </label>
        ) : null}

        <input
          ref={ref}
          className={twMerge(
            "block text-xs text-foreground placeholder:text-foreground leading-full bg-input font-poppins w-full px-4 py-5 h-14 transition rounded-xl border border-border outline-none focus:border-white",
            className
          )}
          id={inputId}
          type={type}
          placeholder={placeholder}
          {...rest}
        />
        {!!error && (
          <p className={twMerge("text-sm text-[#333]", errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  }
);



export const CustomPasswordInput = forwardRef(
  function CustomInput(props, ref) {
    const {
      placeholder,
      type,
      className,
      label = "",
      labelClassName = "",
      containerClassName = "",
      error,
      errorClassName,
      optional,
      ...rest
    } = props;
    const inputId = camelCase(label);

    return (
      <div className={twMerge("", containerClassName)}>
        {label ? (
          <label
            className={twMerge(
              "text-sm font-semibold text-foreground leading-[24px] mb-2 block",
              labelClassName
            )}
            htmlFor={inputId}
          >
            {label}{" "}
            {optional && (
              <span className="not-italic text-sm text-foreground">(optional)</span>
            )}
          </label>
        ) : null}

        <input
          ref={ref}
          className={twMerge(
            "block text-xs text-foreground placeholder:text-foreground leading-full bg-input font-poppins w-full px-4 py-5 h-14 transition rounded-xl border border-border outline-none focus:border-white",
            className
          )}
          id={inputId}
          type={type}
          placeholder={placeholder}
          {...rest}
        />
        {!!error && (
          <p className={twMerge("text-sm text-[#333]", errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  }
);
