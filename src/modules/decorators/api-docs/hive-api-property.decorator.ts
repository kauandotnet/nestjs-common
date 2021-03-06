import { ApiProperty } from '@teamhive/nestjs-swagger';
import { SwaggerEnumType } from '@teamhive/nestjs-swagger/dist/types/swagger-enum.type';
import { ValidationTypes } from 'class-validator';
import { getValidation } from '../../functions/get-validation.function';

export function HiveApiModelProperty(description: string, metadata: {
    example?: any,
    required?: boolean;
    enum?: SwaggerEnumType;
    type?: any;
} = {}): PropertyDecorator {
    return (target, propertyKey: string) => {
        const validations = getValidation(target.constructor, propertyKey);

        metadata.required = (metadata.required !== undefined) ? metadata.required : !validations.includes(ValidationTypes.CONDITIONAL_VALIDATION);

        ApiProperty({
            description,
            ...metadata
        })(target, propertyKey);

    };
}
